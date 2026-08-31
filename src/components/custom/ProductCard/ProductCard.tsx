import React from 'react';
import { ProductListItem } from 'core/base/type/product';

import './ProductCard.scss';

interface ProductCardProps {
  product: ProductListItem;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="product-card">
      {/* <img
        src={product.images}
        alt={product.title}
        className="product-card__image"
      /> */}
      <div className="product-card__details">
        <h3 className="product-card__name">{product.title}</h3>
        <p className="product-card__description">{product.description}</p>
        <p className="product-card__price">${product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
