export type Cart = {
  id: number
  cartId: string
  products: CartProduct[]
}

export type CartProduct = {
  productId: number
  name: string
  price: number
  pictureUrl: string
  brand: string
  type: string
  quantity: number
}
