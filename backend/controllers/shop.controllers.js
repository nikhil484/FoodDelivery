// import Shop from "../models/shop.model.js";
// import uploadOnCloudinary from "../utils/cloudinary.js"

// export const createEditShop= async(req,res)=>{
//     try {
//         const{name,city,state, address}=req.body
//         let image;
//         if(req.file){
//          image= await uploadOnCloudinary(
//             req.file.path
//            )
//         }
//         let shop= await Shop.findOne({owner:req.userId})
//         if(!shop){
//             shop= await Shop.create({
//                name,city,state,address,owner:req.userId 
//             })
//         }else{
//               shop= await Shop.findByIdAndUpdate({
//                name,city,state,address,owner:req.userId 
//         },{new:true})

        
//         }
//         await shop.populate("owner items")
//         return res
//         .status(201)
//         .json(shop)

//     } catch (error) {
//         return res
//         .status(500)
//         .json(`create shop error ${error}`)
        
//     }
// }

import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;

    let image;   // you wanted to keep this
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    // Find shop by owner
    let shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      // ---------------- CREATE NEW SHOP ----------------
      shop = await Shop.create({
        name,
        city,
        state,
        address,
        owner: req.userId,
        ...(image && { image })  // only include if exists
      });

    } else {
      // ---------------- EDIT EXISTING SHOP ----------------
      const updateData = {
        name,
        city,
        state,
        address,
        owner: req.userId
      };

      if (image) updateData.image = image;

      // ❗ FIX: YOU MUST PASS shop._id AS FIRST ARGUMENT
      shop = await Shop.findByIdAndUpdate(
        shop._id,      // this was your error
        updateData,
        { new: true }
      );
    }

    await shop.populate("owner items");

    return res.status(201).json(shop);

  } catch (error) {
    console.log("create shop error:", error);
    return res.status(500).json(`create shop error ${error}`);
  }
};



export const getMyShop= async(req,res)=>{
    try {
        const shop= await Shop.findOne({owner:req.userId}).populate("owner items")
        if(!shop){
            return null}
           return res
              .status(200)
                .json(shop) 
    } catch (error) {
         return res
        .status(500)
        .json(`get my shop error  ${error}`)
    }
}

export const getShopByCity=async(req,res)=>{
  try {
    const {city}=req.params
    const shops= await Shop.find({
      city:{$regex:new RegExp(`^${city}`,"i")}
    }).populate('items')
    if(!shops){
      return res
      .status(400)
      .json({message:"Shops not found"})
    }
    return res
    .status(200)
    .json(shops)
  } catch (error) 
  {
    return res
        .status(500)
        .json(`get shop by city error  ${error}`)
  }
}