import mongoose from "mongoose";

const URI = "mongodb+srv://josecarabajal16:CoderCoder@cluster0.l1u1c.mongodb.net/ecommerceAfrodita3?retryWrites=true&w=majority&appName=Cluster0";

const connectToDB = () => {
    try {
        mongoose.connect(URI);
        console.log('Connected to DB ecommerceAfrodita3');
    } catch (error) {
        console.log('Error connecting to the database:', error);
    }
};

export default connectToDB;
