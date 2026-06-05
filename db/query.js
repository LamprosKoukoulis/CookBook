import {getDb} from "./client.js";


export default async function query(sql,params =[]) {
  const db = await getDb();

  // console.log("SQL:");
  // console.log(sql);
  // console.log("PARAMS:");
  // console.log(params);
  

  try {
    var result = await db.execute(sql,params);
  } catch (err) {
    console.error("FULL DB ERROR:", JSON.stringify(err, null, 2));
    // console.error("RAW:", err?.cause || err?.message);
    throw err;
  }
  
  //  Add labels to rows
  const rows = result.rows.map(row => {
    const obj = {};
    
    result.columns.forEach((col,index) => {
      obj[col] =row[index];
    });
    return obj;
  })

  // console.log("RESULT:");
  // console.table(rows);

  return {rows};
}
