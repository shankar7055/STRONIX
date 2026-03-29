import User from "../models/User.js";

export const getAllUsers = async(req, res) => {
    try{
        const users = await User.find().select("-password");
        res.json(users);
    } catch(err){
        res.status(500).json({ error: err.message});
    }
};

export const deleteUser = async(req , res)=> {
    try{
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);

        res.json({ message: "User deleted"});
    } catch(err){
        res.status(500).json({ error: err.message });
    }
};

export const updateUserRole = async(req,res) => {
    try{
        const { userId } = req.params;
        const {role} = req.body;

        const user = await User.findById(userId);
        user.role = role;
        await user.save();

        res.json(user);
    }catch(err) {
        res.status(500).json({ error: err.message });
    }
};