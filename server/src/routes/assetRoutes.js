import express from 'express'
import { getAssets, getAssetById, createAsset, updateAsset, deleteAsset } from '../controllers/assetController.js'

const router = express.Router()

router.route('/')
  .get(getAssets)
  .post(createAsset)

router.route('/:id')
  .get(getAssetById)
  .put(updateAsset)
  .delete(deleteAsset)

export default router
