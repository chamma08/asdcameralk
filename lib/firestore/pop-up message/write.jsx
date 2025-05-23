import { collection, deleteDoc, doc, setDoc, Timestamp, updateDoc, getDocs, writeBatch } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const createNewMessage = async ({ data, image }) => {
    if (!image) {
        throw new Error("Image is Required");
    }
    if (!data?.name) {
        throw new Error("Name is required");
    }
    
    const newId = doc(collection(db, `ids`)).id;
    const imageRef = ref(storage, `pop-up/${newId}`);
    await uploadBytes(imageRef, image);
    const imageURL = await getDownloadURL(imageRef);
    
    await setDoc(doc(db, `pop-up/${newId}`), {
        ...data,
        id: newId,
        imageURL: imageURL,
        isActive: data?.isActive || false, // Controls if this message should show in popup
        showInPopup: data?.showInPopup || false, // Controls if this specific image is selected for popup
        timestampCreate: Timestamp.now(),
    });
}

export const updateMessage = async ({ data, image }) => {
    if (!data?.name) {
        throw new Error("Name is required");
    }
    if (!data?.id) {
        throw new Error("ID is required");
    }
    const id = data?.id;
    
    let imageURL = data?.imageURL;
    
    if (image) {
        const imageRef = ref(storage, `pop-up/${id}`);
        await uploadBytes(imageRef, image);
        imageURL = await getDownloadURL(imageRef);
    }
    
    await updateDoc(doc(db, `pop-up/${id}`), {
        ...data,
        imageURL: imageURL,
        isActive: data?.isActive || false,
        showInPopup: data?.showInPopup || false,
        timestampUpdate: Timestamp.now(),
    });
}

export const deleteMessage = async ({ id }) => {
    if (!id) {
        throw new Error("ID is required");
    }
    await deleteDoc(doc(db, `pop-up/${id}`));
}

// New function to set which image should show in popup
export const setActivePopupMessage = async ({ id }) => {
    if (!id) {
        throw new Error("ID is required");
    }
    
    // First, disable all other popup messages
    const allMessages = await getDocs(collection(db, "pop-up"));
    const batch = writeBatch(db);
    
    allMessages.docs.forEach((doc) => {
        batch.update(doc.ref, { showInPopup: false });
    });
    
    // Then enable the selected one
    batch.update(doc(db, `pop-up/${id}`), { 
        showInPopup: true,
        isActive: true 
    });
    
    await batch.commit();
}

// New function to toggle popup visibility globally
export const togglePopupVisibility = async ({ show }) => {
    // You might want to store this in a separate settings collection
    await setDoc(doc(db, "settings/popup"), {
        showPopup: show,
        timestampUpdate: Timestamp.now(),
    });
}