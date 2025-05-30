// services/contactForm.js
import { db } from '@/lib/firestore/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


/**
 * Submit contact form data to Firebase Firestore
 * @param {Object} formData - The form data to submit
 * @param {string} formData.name - Contact name
 * @param {string} formData.email - Contact email
 * @param {string} formData.subject - Message subject
 * @param {string} formData.message - Message content
 * @returns {Promise<Object>} - Success/error response
 */
export const submitContactForm = async (formData) => {
  try {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      throw new Error('All fields are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      throw new Error('Please enter a valid email address');
    }

    // Prepare data for submission
    const submissionData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
      timestamp: serverTimestamp(),
      status: 'unread',
      source: 'contact_form'
    };

    // Add document to Firestore
    const docRef = await addDoc(collection(db, 'contact_submissions'), submissionData);

    return {
      success: true,
      id: docRef.id,
      message: 'Your message has been sent successfully! We will get back to you soon.'
    };

  } catch (error) {
    console.error('Error submitting contact form:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to send message. Please try again later.'
    };
  }
};

/**
 * Get all contact form submissions (for admin use)
 * @param {number} limit - Maximum number of submissions to fetch
 * @returns {Promise<Array>} - Array of contact submissions
 */
export const getContactSubmissions = async (limit = 50) => {
  try {
    const { query, orderBy, getDocs, limitToLast } = await import('firebase/firestore');
    
    const q = query(
      collection(db, 'contact_submissions'),
      orderBy('timestamp', 'desc'),
      limitToLast(limit)
    );

    const querySnapshot = await getDocs(q);
    const submissions = [];

    querySnapshot.forEach((doc) => {
      submissions.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return submissions;

  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    throw error;
  }
};

/**
 * Mark a contact submission as read
 * @param {string} submissionId - The ID of the submission to mark as read
 * @returns {Promise<boolean>} - Success status
 */
export const markSubmissionAsRead = async (submissionId) => {
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    
    await updateDoc(doc(db, 'contact_submissions', submissionId), {
      status: 'read',
      readAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error marking submission as read:', error);
    return false;
  }
};

/**
 * Delete a contact submission (admin only)
 * @param {string} submissionId - The ID of the submission to delete
 * @returns {Promise<Object>} - Success/error response
 */
export const deleteContactSubmission = async (submissionId) => {
  try {
    const { doc, deleteDoc } = await import('firebase/firestore');
    
    await deleteDoc(doc(db, 'contact_submissions', submissionId));

    return {
      success: true,
      message: 'Message deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting submission:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete message. Please try again.'
    };
  }
};

/**
 * Delete multiple contact submissions (admin only)
 * @param {Array<string>} submissionIds - Array of submission IDs to delete
 * @returns {Promise<Object>} - Success/error response with details
 */
export const deleteMultipleSubmissions = async (submissionIds) => {
  try {
    const { doc, deleteDoc, writeBatch } = await import('firebase/firestore');
    
    const batch = writeBatch(db);
    
    submissionIds.forEach((id) => {
      const docRef = doc(db, 'contact_submissions', id);
      batch.delete(docRef);
    });

    await batch.commit();

    return {
      success: true,
      message: `Successfully deleted ${submissionIds.length} message(s)`,
      deletedCount: submissionIds.length
    };
  } catch (error) {
    console.error('Error deleting multiple submissions:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete messages. Please try again.'
    };
  }
};