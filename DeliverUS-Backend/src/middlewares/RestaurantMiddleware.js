import { Restaurant, Order } from '../models/models.js'

const checkRestaurantOwnership = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId)
    if (req.user.id === restaurant.userId) {
      return next()
    }
    return res.status(403).send('Not enough privileges. This entity does not belong to you')
  } catch (err) {
    return res.status(500).send(err)
  }
}
const restaurantHasNoOrders = async (req, res, next) => {
  try {
    const numberOfRestaurantOrders = await Order.count({
      where: { restaurantId: req.params.restaurantId }
    })
    if (numberOfRestaurantOrders === 0) {
      return next()
    }
    return res.status(409).send('Some orders belong to this restaurant.')
  } catch (err) {
    return res.status(500).send(err.message)
  }
}
const checkNoRestaurantPromotedIfPromoting = async (req, res, next) => {
  try {
    if (req.body.promoted === true) {
      const numberOfRestaurantOrders = await Restaurant.count({
        where: { userId: req.user.id, promoted: true }
      })
      if (numberOfRestaurantOrders === 0) {
        return next()
      } else {
        return res.status(422).send('Some orders belong to this restaurant.')
      }
    } else {
      return next()
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

export { checkRestaurantOwnership, restaurantHasNoOrders, checkNoRestaurantPromotedIfPromoting }
