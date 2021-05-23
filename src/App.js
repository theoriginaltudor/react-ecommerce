import React, { useState, useEffect } from 'react'
import { commerce } from './lib/commerce';
import { Products, Navbar, Cart } from "./components";

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
        <div>
            <Navbar totalItems={cart.total_items} />
            {/* <Products products={products} onAddToCart={handleAddToCart} /> */}
            <Cart cart={cart} onEmptyCart={handleEmptyCart} />
        </div>
    )
}

export default App
