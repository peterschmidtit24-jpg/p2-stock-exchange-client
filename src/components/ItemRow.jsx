

function ItemRow({ item }) {
  return (
    <div className="item-row">
      <span>{item.name}</span>
      <span>{item.price}</span>
    </div>
  )
}

export default ItemRow