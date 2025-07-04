service cloud.firestore {
  match /databases/{database}/documents {

    function isAdmin() {
      return exists(/databases/$(database)/documents/admins/$(request.auth.token.email));
    }

    match /admins/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /settings/{document=**} {
      allow read, write;
    }

    match /contact_submissions/{document} {
      // Allow anyone to create (submit contact forms)
      allow create: if true;

      // For reading, updating, and deleting, use the same isAdmin() function as other collections
      // This checks if the user's email exists in the admins collection
      allow read, update, delete: if request.auth != null && isAdmin();
    }

    match /logos/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /brands/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /images/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /bgImages/{id} {
        allow read: if true;
      allow write: if isAdmin();
    }

    match /pop-up/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /banners/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /categories/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /collections/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /orders/{id} {
      allow read: if isAdmin() || request.auth.uid == resource.data.uid;
      allow write: if isAdmin();
    }

    match /products/{id} {
      allow read: if true;
      allow write: if isAdmin();
      match /reviews/{uid} {
        allow read: if true;
        allow write: if isAdmin() || request.auth.uid == uid;
      }
    }

    match /users/{uid} {
      allow read: if isAdmin() || request.auth.uid == uid;
      allow write: if isAdmin() || request.auth.uid == uid;
      match /checkout_sessions/{id} {
        allow read: if isAdmin() || request.auth.uid == uid;
        allow write: if isAdmin() || request.auth.uid == uid;
      }
      match /checkout_sessions_cod/{id} {
        allow read: if isAdmin() || request.auth.uid == uid;
        allow write: if isAdmin() || request.auth.uid == uid;
      }
      match /payments/{id} {
        allow read, write: if false;
      }
    }
  }
}











service cloud.firestore {
  match /databases/{database}/documents {
    
    // Function to check if current date is before expiration date
    function isBeforeExpiration() {
      // Set your expiration date here (YYYY-MM-DD format)
      // Example: December 31, 2025
      return request.time < timestamp.date(2025, 12, 31);
    }
    
    function isAdmin() {
      return exists(/databases/$(database)/documents/admins/$(request.auth.token.email));
    }
    
    // Apply date restriction to all admin functions
    function isAdminWithDateCheck() {
      return isAdmin() && isBeforeExpiration();
    }
    
    match /admins/{id} {
      allow read: if isBeforeExpiration();
      allow write: if isAdminWithDateCheck();
    }
    
    match /settings/{document=**} {
      allow read, write: if isBeforeExpiration();
    }
    
    match /contact_submissions/{document} {
      // Allow anyone to create (submit contact forms) only before expiration
      allow create: if isBeforeExpiration();
      
      // For reading, updating, and deleting, check both admin status and date
      allow read, update, delete: if request.auth != null && isAdminWithDateCheck();
    }
    
    match /logos/{id} {
      allow read: if isBeforeExpiration();
      allow write: if isAdminWithDateCheck();
    }
    
    match /brands/{id} {
      allow read: if isBeforeExpiration();
      allow write: if isAdminWithDateCheck();
    }
    
    match /images/{id} {
      allow read: if isBeforeExpiration();
      allow write: if isAdminWithDateCheck();
    }
    
    match /bgImages/{id} {
    	allow read: if isBeforeExpiration();
      allow write: if isAdminWithDateCheck();
    }
    
    match /pop-up/{id} {
      allow read: if isBeforeExpiration();
      allow write: if isAdminWithDateCheck();
    }
    
    match /banners/{id} {
      allow read: if isBeforeExpiration();
      allow write: if isAdminWithDateCheck();
    }
    
    match /categories/{id} {
      allow read: if isBeforeExpiration();
      allow write: if isAdminWithDateCheck();
    }
    
    match /collections/{id} {
      allow read: if isBeforeExpiration();
      allow write: if isAdminWithDateCheck();
    }
    
    match /orders/{id} {
      allow read: if isBeforeExpiration() && (isAdmin() || request.auth.uid == resource.data.uid);
      allow write: if isAdminWithDateCheck();
    }
    
    match /products/{id} {
      allow read: if isBeforeExpiration();
      allow write: if isAdminWithDateCheck();
      match /reviews/{uid} {
        allow read: if isBeforeExpiration();
        allow write: if isBeforeExpiration() && (isAdmin() || request.auth.uid == uid);
      }
    }
    
    match /users/{uid} {
      allow read: if isBeforeExpiration() && (isAdmin() || request.auth.uid == uid);
      allow write: if isBeforeExpiration() && (isAdmin() || request.auth.uid == uid);
      match /checkout_sessions/{id} {
        allow read: if isBeforeExpiration() && (isAdmin() || request.auth.uid == uid);
        allow write: if isBeforeExpiration() && (isAdmin() || request.auth.uid == uid);
      }
      match /checkout_sessions_cod/{id} {
        allow read: if isBeforeExpiration() && (isAdmin() || request.auth.uid == uid);
        allow write: if isBeforeExpiration() && (isAdmin() || request.auth.uid == uid);
      }
      match /payments/{id} {
        allow read, write: if false;
      }
    }
  }
}