import React, { useState, useEffect } from 'react'
import { commerce } from './lib/commerce';
import { Products, Navbar, Cart } from "./components";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});

    const fetchProducts = async () => {
        const { data } = await commerce.products.list();
        setProducts(data);
    };

    const fetchCart = async () => {
        const data = await commerce.cart.retrieve();
        setCart(data);
    };

    const handleAddToCart = async (productId, quantity) => {
        const item = await commerce.cart.add(productId, quantity);
        setCart(item.cart);
    }

    const handleEmptyCart = async () => {
        const { succes, event, cart } = await commerce.cart.empty();
        setCart(cart);
    }

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

    return (
        <Router>
            <div>
                <Navbar totalItems={cart.total_items} />
                <Switch>
                    <Route exact path='/'>
                        <Products products={products} onAddToCart={handleAddToCart} />
                    </Route>
                    <Route exact path='/cart'>
                        <Cart cart={cart} onEmptyCart={handleEmptyCart} />
                    </Route>
                </Switch>

            </div>
        </Router>

    )
}

export default App
