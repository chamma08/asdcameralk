"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaEnvelopeOpen, FaUser, FaClock, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { MdEmail, MdSubject, MdMessage, MdRefresh, MdDeleteSweep } from 'react-icons/md';
import { getContactSubmissions, markSubmissionAsRead, deleteContactSubmission, deleteMultipleSubmissions } from '@/app/services/contactForm';

const AdminContactSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch submissions on component mount
  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getContactSubmissions(100);
      setSubmissions(data);
    } catch (err) {
      setError('Failed to load contact submissions');
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (submissionId) => {
    try {
      const success = await markSubmissionAsRead(submissionId);
      if (success) {
        setSubmissions(prev => 
          prev.map(sub => 
            sub.id === submissionId 
              ? { ...sub, status: 'read' }
              : sub
          )
        );
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDeleteSingle = async (submissionId) => {
    setItemToDelete(submissionId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteMultiple = async () => {
    if (selectedItems.size === 0) {
      setError('Please select items to delete');
      return;
    }
    setItemToDelete(Array.from(selectedItems));
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      let result;
      
      if (Array.isArray(itemToDelete)) {
        // Multiple delete
        result = await deleteMultipleSubmissions(itemToDelete);
      } else {
        // Single delete
        result = await deleteContactSubmission(itemToDelete);
      }

      if (result.success) {
        // Remove deleted items from local state
        if (Array.isArray(itemToDelete)) {
          setSubmissions(prev => prev.filter(sub => !itemToDelete.includes(sub.id)));
          setSelectedItems(new Set());
        } else {
          setSubmissions(prev => prev.filter(sub => sub.id !== itemToDelete));
          if (selectedSubmission?.id === itemToDelete) {
            setSelectedSubmission(null);
          }
        }
        setSuccessMessage(result.message);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to delete message(s)');
      console.error('Delete error:', error);
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
  };

  const handleSelectItem = (submissionId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(submissionId)) {
      newSelected.delete(submissionId);
    } else {
      newSelected.add(submissionId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredSubmissions.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredSubmissions.map(sub => sub.id)));
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (filter === 'unread') return submission.status === 'unread';
    if (filter === 'read') return submission.status === 'read';
    return true;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-300 rounded w-1/3"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
                <p className="text-gray-600 mt-1">
                  Total: {submissions.length} submissions
                  {selectedItems.size > 0 && ` • ${selectedItems.size} selected`}
                </p>
              </div>
              
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={fetchSubmissions}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <MdRefresh />
                  Refresh
                </button>

                {selectedItems.size > 0 && (
                  <button
                    onClick={handleDeleteMultiple}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <MdDeleteSweep />
                    Delete Selected ({selectedItems.size})
                  </button>
                )}
                
                {/* Filter buttons */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {['all', 'unread', 'read'].map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      className={`px-4 py-2 rounded-md capitalize transition-colors ${
                        filter === filterType
                          ? 'bg-white shadow-sm text-gray-900'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {filterType}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Success Message */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-green-50 border border-green-200 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 text-green-700">
                  <FaCheck className="text-green-500" />
                  {successMessage}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error message */}
          {error && (
            <motion.div
              variants={itemVariants}
              className="bg-red-50 border border-red-200 rounded-xl p-4"
            >
              <div className="text-red-700">{error}</div>
            </motion.div>
          )}

          {/* Submissions List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* List View */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {filter === 'all' ? 'All Submissions' : 
                   filter === 'unread' ? 'Unread Messages' : 'Read Messages'}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({filteredSubmissions.length})
                  </span>
                </h2>

                {filteredSubmissions.length > 0 && (
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {selectedItems.size === filteredSubmissions.length ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>

              {filteredSubmissions.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center">
                  <FaEnvelope className="text-4xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No submissions found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredSubmissions.map((submission) => (
                    <motion.div
                      key={submission.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01 }}
                      className={`bg-white rounded-xl p-4 border-2 transition-all ${
                        selectedSubmission?.id === submission.id
                          ? 'border-red-500 shadow-lg'
                          : selectedItems.has(submission.id)
                          ? 'border-blue-300 shadow-md'
                          : 'border-transparent hover:border-gray-200 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(submission.id)}
                            onChange={() => handleSelectItem(submission.id)}
                            className="mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          
                          <div 
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {submission.status === 'unread' ? (
                                <FaEnvelope className="text-red-500" />
                              ) : (
                                <FaEnvelopeOpen className="text-gray-400" />
                              )}
                              <span className={`text-sm font-medium ${
                                submission.status === 'unread' ? 'text-red-500' : 'text-gray-500'
                              }`}>
                                {submission.status === 'unread' ? 'New' : 'Read'}
                              </span>
                            </div>
                            
                            <h3 className="font-semibold text-gray-900 truncate">
                              {submission.subject}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              From: {submission.name} ({submission.email})
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              {formatDate(submission.timestamp)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {submission.status === 'unread' && (
                            <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                          )}
                          <button
                            onClick={() => handleDeleteSingle(submission.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete message"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Detail View */}
            <motion.div variants={itemVariants} className="lg:sticky lg:top-6">
              {selectedSubmission ? (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Message Details</h2>
                    <div className="flex gap-2">
                      {selectedSubmission.status === 'unread' && (
                        <button
                          onClick={() => handleMarkAsRead(selectedSubmission.id)}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteSingle(selectedSubmission.id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Status */}
                    <div className="flex items-center gap-2">
                      {selectedSubmission.status === 'unread' ? (
                        <FaEnvelope className="text-red-500" />
                      ) : (
                        <FaEnvelopeOpen className="text-gray-400" />
                      )}
                      <span className={`font-medium ${
                        selectedSubmission.status === 'unread' ? 'text-red-500' : 'text-gray-500'
                      }`}>
                        {selectedSubmission.status === 'unread' ? 'Unread' : 'Read'}
                      </span>
                    </div>

                    {/* Sender Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaUser className="text-gray-500" />
                        <span className="font-medium text-gray-900">
                          {selectedSubmission.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdEmail className="text-gray-500" />
                        <span className="text-gray-600">{selectedSubmission.email}</span>
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MdSubject className="text-gray-500" />
                        <span className="font-medium text-gray-700">Subject</span>
                      </div>
                      <p className="text-gray-900 bg-gray-50 rounded-lg p-3">
                        {selectedSubmission.subject}
                      </p>
                    </div>

                    {/* Message */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MdMessage className="text-gray-500" />
                        <span className="font-medium text-gray-700">Message</span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-900 whitespace-pre-wrap">
                          {selectedSubmission.message}
                        </p>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaClock />
                      <span>Received: {formatDate(selectedSubmission.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <FaEnvelope className="text-4xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a message
                  </h3>
                  <p className="text-gray-500">
                    Click on a submission from the list to view its details
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => !deleteLoading && setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <FaTrash className="text-red-600" />
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Confirm Delete
                </h3>

                <p className="text-gray-500 mb-6">
                  {Array.isArray(itemToDelete) 
                    ? `Are you sure you want to delete ${itemToDelete.length} selected message(s)? This action cannot be undone.`
                    : 'Are you sure you want to delete this message? This action cannot be undone.'
                  }
                </p>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleteLoading}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleteLoading}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {deleteLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <FaTrash />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminContactSubmissions;