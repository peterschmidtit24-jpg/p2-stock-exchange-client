
import ItemRow from './ItemRow'
import List from '@mui/material/List'

import { useNavigate } from 'react-router-dom'

function ItemsList({ collection1, collection2, onDelete }) {
  const navigate = useNavigate();

  // overflowY: 'auto', to make the list scrollable when it exceeds the max height

  // onClick function shall route to the BuyAndSellPage with the stock details, but for now it just logs the company name to the console

  function handleItemClick(company, stock) {
    // route to the BuyAndSellPage with the stock details
    navigate(`/buy-and-sell/${stock.id}`);

  }

  function handleEditClick(company, stock) {
    navigate(`/update-data/${stock.id}`, {
      state: {
        company,
        stock,
      },
    });
  }

  function handleDeleteClick(company, stock) {
    onDelete(company, stock);
  }


  return (
    <List
      sx={{
        maxHeight: 550,
        overflowY: "auto",
        bgcolor: "#0b1220",
        p: 1,
      }}
    >
      {collection1.map((company) => {
        const stock = collection2.find((currentStock) => currentStock.companyId === company.id);

        return (
          <ItemRow
            key={company.id}
            company={company}
            stock={stock}
            onClick={() => handleItemClick(company, stock)}
            onEdit={() => handleEditClick(company, stock)}
            onDelete={() => handleDeleteClick(company, stock)}
          />
        );
      })}
    </List>
  );
}

export default ItemsList
