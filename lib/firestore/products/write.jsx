import { collection, deleteDoc, doc, setDoc, Timestamp } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const createNewProduct = async ({ data, featureImage, imageList }) => {
    if (!data?.title) {
      throw new Error("Title is required");
    }
    
    // Validate categories
    if (!data?.categoryIds || !Array.isArray(data.categoryIds) || data.categoryIds.length === 0) {
      throw new Error("At least one category is required");
    }
    
    /* if (!featureImage) {
      throw new Error("Feature Image is required");
    } */
    
    let featureImageURL = "";
    if (featureImage) {
      const featureImageRef = ref(storage, `products/${featureImage?.name}`);
      await uploadBytes(featureImageRef, featureImage);
      featureImageURL = await getDownloadURL(featureImageRef);
    }
  
    let imageURLList = [];
  
    for (let i = 0; i < imageList?.length; i++) {
      const image = imageList[i];
      const imageRef = ref(storage, `products/${image?.name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);
      imageURLList.push(url);
    }
  
    const newId = doc(collection(db, `ids`)).id;

    // Prepare the product data
    const productData = {
      ...data,
      featureImageURL: featureImageURL,
      imageList: imageURLList,
      id: newId,
      timestampCreate: Timestamp.now(),
    };

    // Remove old categoryId field if it exists to avoid confusion
    delete productData.categoryId;
  
    await setDoc(doc(db, `products/${newId}`), productData);
  };
  
  export const updateProduct = async ({ data, featureImage, imageList }) => {
    if (!data?.title) {
      throw new Error("Title is required");
    }
    if (!data?.id) {
      throw new Error("ID is required");
    }

    // Validate categories
    if (!data?.categoryIds || !Array.isArray(data.categoryIds) || data.categoryIds.length === 0) {
      throw new Error("At least one category is required");
    }
  
    let featureImageURL = data?.featureImageURL ?? "";
  
    if (featureImage) {
      const featureImageRef = ref(storage, `products/${featureImage?.name}`);
      await uploadBytes(featureImageRef, featureImage);
      featureImageURL = await getDownloadURL(featureImageRef);
    }
  
    let imageURLList = imageList?.length === 0 ? data?.imageList : [];
  
    for (let i = 0; i < imageList?.length; i++) {
      const image = imageList[i];
      const imageRef = ref(storage, `products/${image?.name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);
      imageURLList.push(url);
    }

    // Prepare the product data
    const productData = {
      ...data,
      featureImageURL: featureImageURL,
      imageList: imageURLList,
      timestampUpdate: Timestamp.now(),
    };

    // Remove old categoryId field if it exists to avoid confusion
    delete productData.categoryId;
  
    await setDoc(doc(db, `products/${data?.id}`), productData);
  };
  
  export const deleteProduct = async ({ id }) => {
    if (!id) {
      throw new Error("ID is required");
    }
    await deleteDoc(doc(db, `products/${id}`));
  };

  // Migration function to convert existing products from single category to multiple categories
  export const migrateProductCategories = async () => {
    const { getProducts } = await import("./read_server");
    const products = await getProducts();
    
    const migrationsNeeded = products.filter(product => 
      product.categoryId && !product.categoryIds
    );

    console.log(`Found ${migrationsNeeded.length} products that need category migration`);

    for (const product of migrationsNeeded) {
      try {
        const updatedData = {
          ...product,
          categoryIds: [product.categoryId], // Convert single category to array
        };
        
        // Remove the old categoryId field
        delete updatedData.categoryId;
        
        await setDoc(doc(db, `products/${product.id}`), {
          ...updatedData,
          timestampUpdate: Timestamp.now(),
        });
        
        console.log(`Migrated product: ${product.title}`);
      } catch (error) {
        console.error(`Failed to migrate product ${product.id}:`, error);
      }
    }
    
    console.log("Category migration completed");
  };