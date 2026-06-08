
import ItemRow from './ItemRow'

function ItemsList({ items }) {
  return (
    <ul>
      {items.map((item, index) => (
        <ItemRow key={index} item={item} />
      ))}
    </ul>
  )
}

export default ItemsList
