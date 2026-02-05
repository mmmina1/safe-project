// src/api/reviewApi.js
import axiosInstance from "./axiosInstance";

export const getProductReviews = (productId, params) =>
  axiosInstance
    .get(`/api/products/${productId}/reviews`, { params })
    .then((r) => r.data);

export const createProductReview = (productId, body) =>
  axiosInstance
    .post(`/api/products/${productId}/reviews`, body)
    .then((r) => r.data);

export const updateProductReview = (productId, reviewId, payload) =>
  axiosInstance
    .put(`/api/products/${productId}/reviews/${reviewId}`, payload)
    .then((r) => r.data);

export const deleteProductReview = (productId, reviewId) =>
  axiosInstance
    .delete(`/api/products/${productId}/reviews/${reviewId}`)
    .then((r) => r.data);

export const toggleReviewLike = (productId, reviewId) =>
  axiosInstance
    .post(`/api/products/${productId}/reviews/${reviewId}/like`)
    .then((r) => r.data);
