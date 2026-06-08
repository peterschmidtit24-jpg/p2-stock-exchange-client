
import ItemRow from './ItemRow'
import List from '@mui/material/List'

import { useNavigate } from 'react-router-dom'

function ItemsList({ collection1, collection2 }) {
  const navigate = useNavigate();

  // overflowY: 'auto', to make the list scrollable when it exceeds the max height

  // onClick function shall route to the BuyAndSellPage with the stock details, but for now it just logs the company name to the console

  function handleItemClick(company, stock) {
    // console.log(`Clicked on ${company.name}`);
    // route to the BuyAndSellPage with the stock details
    // navigate(`/buy-and-sell/${company.id}`);
    navigate(`/buy-and-sell/${stock.id}`);

    console.log("company = ", company);
    console.log("stock xxx = ", stock.id);
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
      {collection1.map((company, index) => (
        <ItemRow
          key={company.id}
          company={company}
          stock={collection2.find((stock) => stock.companyId === company.id)}
          onClick={() =>
            handleItemClick(
              company,
              collection2.find((stock) => stock.companyId === company.id),
            )
          }
        />
      ))}
    </List>
  );
}

export default ItemsList
