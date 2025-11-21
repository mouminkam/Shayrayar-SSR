/**
 * Notifications API endpoints
 * Handles FCM token updates, notifications retrieval, and notification management
 */

import axiosInstance from './config/axios';

/**
 * Update FCM token for push notifications
 * @param {Object} tokenData - FCM token data
 * @param {string} tokenData.fcm_token - Firebase Cloud Messaging token
 * @returns {Promise<Object>} Response confirming token update
 */
export const updateFCMToken = async (tokenData) => {
  const response = await axiosInstance.post('/notifications/update-fcm-token', tokenData);
  return response;
};

/**
 * Get all notifications for the authenticated user
 * @param {Object} params - Query parameters (optional)
 * @returns {Promise<Object>} Response with notifications list
 */
export const getNotifications = async (params = {}) => {
  const response = await axiosInstance.get('/notifications', { params });
  return response;
};

/**
 * Mark a notification as read
 * @param {number} notificationId - Notification ID
 * @returns {Promise<Object>} Response confirming notification marked as read
 */
export const markNotificationAsRead = async (notificationId) => {
  const response = await axiosInstance.get(`/notifications/${notificationId}/read`);
  return response;
};

/**
 * Get unread notifications count
 * @returns {Promise<Object>} Response with unread count
 */
export const getUnreadCount = async () => {
  const response = await axiosInstance.get('/notifications/unread-count');
  return response;
};

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} Response confirming all notifications marked as read
 */
export const markAllAsRead = async () => {
  const response = await axiosInstance.post('/notifications/mark-all-read');
  return response;
};

/**
 * Delete a notification
 * @param {number} notificationId - Notification ID
 * @returns {Promise<Object>} Response confirming notification deletion
 */
export const deleteNotification = async (notificationId) => {
  const response = await axiosInstance.delete(`/notifications/${notificationId}`);
  return response;
};

/**
 * Delete all notifications
 * @returns {Promise<Object>} Response confirming all notifications deleted
 */
export const deleteAllNotifications = async () => {
  const response = await axiosInstance.delete('/notifications');
  return response;
};

// Default export with all notification functions
const notificationsAPI = {
  updateFCMToken,
  getNotifications,
  markNotificationAsRead,
  getUnreadCount,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
};

export default notificationsAPI;

