const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

const getAll = (req, res, next) => {
    Order.find()
        .select('product quantity id')
        .populate('product', 'name price productImage')
        .exec()
        .then(results => {
            if(results.length > 0){
                res.status(200).json({
                    count: results.length,
                    orders: results.map(result => {
                        return {
                            _id: result._id,
                            product: result.product,
                            quantity: result.quantity,
                            request: {
                                type: "GET",
                                url: `http://localhost:3000/orders/${result._id}`
                            }
                        }
                    })
                });
            }
            else{
                res.status(404).json({message: "No records found"});
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

const create = (req, res, next) => {
    Product.findById(req.body.product)
        .select('name price _id')
        .exec()
        .then(prod => {
            if(!prod){
                return res.status(404).json({
                    message: `product with id ${req.body.product} is not available`
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.product
            });

            return order.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    product: result.product,
                    quantity: result.quantity,
                    _id: result._id,
                    request: {
                        type: "GET",
                        url: `http://localhost:3000/orders/${result._id}`
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

const getById = (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .select('product quantity _id')
        .populate('product', 'name price productImage')
        .exec()
        .then(result => {
            if(result){
                res.status(200).json({
                    order: result,
                    request: {
                        type: "GET",
                        url: `http://localhost:3000/orders`
                    }
                });
            }
            else{
                res.status(404).json({message: 'Not found'});
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

const update = (req, res, next) => {
    const id = req.params.orderId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    console.log(updateOps);
    Order.updateOne( {_id: id },
        { 
            $set: updateOps 
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Order updated",
                request: {
                    type: "GET",
                    url: `http://localhost:3000/orders/${id}`
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

const destroy = (req, res, next) => {
    const id = req.params.orderId;
    Order.deleteOne({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Order deleted",
            request: {
                type: "POST",
                url: `http://localhost:3000/orders`,
                body: { product: "ID", quantity: "Number" }
            }
        });
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
}

module.exports = {
    getAll: getAll,
    getById: getById,
    create: create,
    update: update,
    destroy: destroy
}