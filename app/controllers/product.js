const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/product');

const getAll = (req, res, next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        if(docs.length > 0){
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: "GET",
                            url: `http://localhost:3000/products/${doc._id}`
                        }
                    }
                })
            };

            res.status(200).json(response);

        }
        else{
            res.status(404).json({message: "No records found"});
        }
    })
    .catch(err => {
        res.status(500).json(err);
    });
}

const create = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product
    .save()
    .then(result => {
        res.status(201).json({
            message: 'Successfully created',
            createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    productImage: result.productImage,
                    request: {
                        type: "GET",
                        url: `http://localhost:3000/products/${result._id}`
                    }
                }
            });
    })
    .catch(err => {
        res.status(500).json(
            {
                error: err
            })
    });
}

const getById =  (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            if(doc){
                res.status(200).json({
                    product: doc,
                    request: {
                        type: "GET",
                        url: `http://localhost:3000/products`
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
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    console.log(updateOps);
    Product.updateOne( {_id: id },
        { 
            $set: updateOps 
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product updated",
                request: {
                    type: "GET",
                    url: `http://localhost:3000/products/${id}`
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
    const id = req.params.productId;
    Product.deleteOne({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Product deleted",
            request: {
                type: "POST",
                url: `http://localhost:3000/products`,
                body: { name: "String", price: "Number" }
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