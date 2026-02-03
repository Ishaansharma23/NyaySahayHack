import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ImageKit = require('imagekit');
import ApiError from '../utils/ApiError.js';
import mongoose from 'mongoose';

let imagekit = null;

const initImageKit = () => {
    if (imagekit) return imagekit;

    const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } = process.env;

    if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
        return null;
    }

    imagekit = new ImageKit({
        publicKey: IMAGEKIT_PUBLIC_KEY,
        privateKey: IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: IMAGEKIT_URL_ENDPOINT
    });

    return imagekit;
};

export const uploadFile = (file, folder = 'NyaySahay') => {
    return new Promise((resolve, reject) => {
        const client = initImageKit();
        if (!client) {
            return reject(ApiError.internal('ImageKit is not configured'));
        }

        client.upload({
            file: file.buffer,
            fileName: (new mongoose.Types.ObjectId()).toString(),
            folder: folder
        }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

export const uploadMultipleFiles = async (files, folder = 'NyaySahay') => {
    try {
        const uploadPromises = files.map(file => uploadFile(file, folder));
        const results = await Promise.all(uploadPromises);
        return results;
    } catch (error) {
        throw error;
    }
};

export default uploadFile;