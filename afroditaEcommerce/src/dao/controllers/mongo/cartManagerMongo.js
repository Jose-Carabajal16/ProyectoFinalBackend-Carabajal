import { cartsModel } from "../../models/carts.model.js";

class CartManager {

    // obtener todos los carritos
    getCarts = async () => {
        try {
            const carts = await cartsModel.find();
            console.log("Carritos obtenidos:", carts);
            return carts;
        } catch (err) {
            console.log("Error al obtener carritos:", err);
        }
    }

    // obtener carrito por id
    getCartById = async (cartId) => {
        try {
            const cart = await cartsModel.findOne({ _id: cartId }).lean().populate("products._id");
            console.log("Carrito obtenido por ID:", cart);
            return cart;
        } catch (err) {
            console.log("Error al obtener carrito por ID:", err.message);
            return err.message;
        }
    }

    // agregar un nuevo carrito
    addCart = async (products) => {
        try {
            const cartCreated = await cartsModel.create({});
            console.log("Carrito creado:", cartCreated);
            products.forEach(product => cartCreated.products.push(product));
            await cartCreated.save();
            console.log("Productos agregados al carrito:", cartCreated.products);
            return cartCreated;
        } catch (err) {
            console.log("Error al agregar carrito:", err.message);
            return err.message;
        }
    }

    // agregar producto a un carrito existente
    addProductInCart = async (cid, productFromBody) => {
        try {
            const cart = await cartsModel.findOne({ _id: cid });
            console.log("Carrito encontrado:", cart);
            const findProduct = cart.products.some(
                (product) => product._id.toString() === productFromBody._id
            );
            console.log("¿Producto encontrado en carrito?:", findProduct);

            if (findProduct) {
                await cartsModel.updateOne(
                    { _id: cid, "products._id": productFromBody._id },
                    { $inc: { "products.$.quantity": productFromBody.quantity } }
                );
                const updatedCart = await cartsModel.findOne({ _id: cid });
                console.log("Producto actualizado en carrito:", updatedCart);
                return updatedCart;
            }

            await cartsModel.updateOne(
                { _id: cid },
                {
                    $push: {
                        products: {
                            _id: productFromBody._id,
                            quantity: productFromBody.quantity
                        }
                    }
                }
            );
            const cartUpdatedWithProduct = await cartsModel.findOne({ _id: cid });
            console.log("Producto agregado al carrito:", cartUpdatedWithProduct);
            return cartUpdatedWithProduct;
        } catch (err) {
            console.log("Error al agregar producto al carrito:", err.message);
            return err;
        }
    }

    // actualizar productos en un carrito
    updateProductsInCart = async (cid, products) => {
        try {
            const updatedCart = await cartsModel.findOneAndUpdate(
                { _id: cid },
                { products },
                { new: true }
            );
            console.log("Carrito actualizado:", updatedCart);
            return updatedCart;
        } catch (err) {
            console.log("Error al actualizar productos en carrito:", err);
            return err;
        }
    }

    // actualizar un solo producto en un carrito
    updateOneProduct = async (cid, products) => {
        try {
            await cartsModel.updateOne({ _id: cid }, { products });
            const updatedCart = await cartsModel.findOne({ _id: cid });
            console.log("Producto actualizado en carrito:", updatedCart);
            return updatedCart;
        } catch (err) {
            console.log("Error al actualizar un producto en carrito:", err);
            return err;
        }
    }
}

export default CartManager;
