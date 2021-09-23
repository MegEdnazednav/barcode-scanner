import { API } from '../utils/api'

export const BarcodeService = {
  markAsManufactured(barcode) {
    return API.get(`/barcodes/new?barcode=${barcode}`).then(res => res.data)
  }
}
