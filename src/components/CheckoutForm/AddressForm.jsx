import React, { useState, useEffect } from 'react'
import { Grid, Typography, Button } from '@material-ui/core'
import { useForm, FormProvider } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { commerce } from '../../lib/commerce'

import FormInput from './CustomTextField'
import FormSelect from './CustomSelect'

const AddressForm = ({ token, next }) => {
    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
    const [shippingSubdivision, setShippingSubdivision] = useState('');
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState('');
    const methods = useForm();

    const countriesList = Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name }));
    const subdivisionsList = Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name }));
    const optionsList = shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` }));

    const fetchShippingCountries = async (checkoutTokenId) => {
        const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);

        setShippingCountries(countries);
        setShippingCountry(Object.keys(countries)[0]);
    };

    const fetchSubdivisions = async (checkoutTokenId, countryCode) => {
        const { subdivisions } = await commerce.services.localeListShippingSubdivisions(checkoutTokenId, countryCode);

        setShippingSubdivisions(subdivisions);
        setShippingSubdivision(Object.keys(subdivisions)[0]);
    };

    const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
        const shippingOptionsResponse = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region });

        setShippingOptions(shippingOptionsResponse);
        setShippingOption(shippingOptionsResponse ? shippingOptionsResponse[0].id : '');
    };

    useEffect(() => {
        fetchShippingCountries(token.id);
    }, [token.id]);

    useEffect(() => {
        if (shippingCountry)
            fetchSubdivisions(token.id, shippingCountry);
    }, [token.id, shippingCountry]);

    useEffect(() => {
        if (shippingSubdivision)
            fetchShippingOptions(token.id, shippingCountry, shippingSubdivision);

    }, [token.id, shippingCountry, shippingSubdivision])
    return (
        <>
            <Typography variant='h6' gutterBottom> Shipping Address </Typography>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit((data) => next({ ...data, shippingOption, shippingSubdivision, shippingCountry }))}>
                    <Grid container spacing={3}>
                        <FormInput
                            required
                            name='firstName'
                            label='First name'
                        />
                        <FormInput
                            required
                            name='lastName'
                            label='Last name'
                        />
                        <FormInput
                            required
                            name='address1'
                            label='Address'
                        />
                        <FormInput
                            required
                            name='email'
                            label='Email'
                        />
                        <FormInput
                            required
                            name='city'
                            label='City'
                        />
                        <FormInput
                            required
                            name='zip'
                            label='Zip'
                        />
                        <FormSelect
                            label='Shipping Country'
                            valuesList={countriesList}
                            setValue={setShippingCountry}
                            initialValue={shippingCountry}
                        />
                        <FormSelect
                            label='Shipping Subdivision'
                            valuesList={subdivisionsList}
                            setValue={setShippingSubdivision}
                            initialValue={shippingSubdivision}
                        />
                        <FormSelect
                            label='Shipping Options'
                            valuesList={optionsList}
                            setValue={setShippingOption}
                            initialValue={shippingOption}
                        />
                    </Grid>
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button component={Link} to='/cart' variant='outlined'>Back to cart</Button>
                        <Button type="submit" variant='contained' color='primary'>Next</Button>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default AddressForm
