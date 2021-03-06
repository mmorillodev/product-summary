import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
// eslint-disable-next-line no-restricted-imports
import { compose, pathOr, path } from 'ramda'
import { CollectionBadges, DiscountBadge } from 'vtex.store-components'

import ImagePlaceholder from '../../components/ImagePlaceholder'
import { productShape } from '../../utils/propTypes'
import productSummary from '../../productSummary.css'

const maybeBadge = ({ listPrice, price, label }) => (shouldShow) => (
  component
) => {
  if (shouldShow) {
    return (
      <DiscountBadge listPrice={listPrice} sellingPrice={price} label={label}>
        {component}
      </DiscountBadge>
    )
  }

  return component
}

const maybeCollection = ({ productClusters }) => (shouldShow) => (
  component
) => {
  if (shouldShow && productClusters && productClusters.length > 0) {
    const collections = productClusters.map((cl) => cl.name)

    return (
      <CollectionBadges collectionBadgesText={collections}>
        {component}
      </CollectionBadges>
    )
  }

  return component
}

const ProductImage = ({
  product,
  showBadge,
  badgeText,
  showCollections,
  displayMode,
}) => {
  const [error, setError] = useState(false)

  if (!path(['sku', 'image', 'imageUrl'], product) || error) {
    return <ImagePlaceholder cssHandle={productSummary.imagePlaceholder} />
  }

  const {
    productClusters,
    productName: name,
    sku: {
      image: { imageUrl },
    },
  } = product

  const imageClassName = classNames({
    [productSummary.imageNormal]: displayMode !== 'inline',
    [productSummary.imageInline]: displayMode === 'inline',
  })

  const commertialOffer = pathOr(
    {},
    ['sku', 'seller', 'commertialOffer'],
    product
  )

  const withBadge = maybeBadge({
    listPrice: commertialOffer.ListPrice,
    price: commertialOffer.Price,
    label: badgeText,
  })

  const withCollection = maybeCollection({ productClusters })
  const img = (
    <img
      className={imageClassName}
      src={imageUrl}
      alt={name}
      onError={() => setError(true)}
    />
  )

  return compose(withBadge(showBadge), withCollection(showCollections))(img)
}

ProductImage.propTypes = {
  /** Product that owns the informations */
  product: productShape,
  /** Set the discount badge's visibility */
  showBadge: PropTypes.bool,
  /** Text shown on badge */
  badgeText: PropTypes.string,
  /** Defines if the collection badges are shown */
  showCollections: PropTypes.bool,
  /** Display mode of the summary */
  displayMode: PropTypes.string,
}

export default ProductImage
