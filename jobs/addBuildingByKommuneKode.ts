import { AddBuildingByKommuneKode, models } from '@teamkeel/sdk';
import fetch from "node-fetch";
import { parse } from 'csv-parse/sync';

function findByMatchingProperties(set, properties) {
    return set.filter(function (entry) {
        return Object.keys(properties).every(function (key) {
            return entry[key] === properties[key];
        });
    });
}

// To learn more about jobs, visit https://docs.keel.so/jobs
export default AddBuildingByKommuneKode(async (ctx, inputs) => {

    const endpoint = `https://api.dataforsyningen.dk/adresser?kommunekode=`+(<string>inputs.kommunekode.toString())+`&format=csv`


	const response = await fetch(`${endpoint}`, { 
		method: 'GET',
		headers:{
		  'Access-Control-Allow-Origin': '*',
		  'Access-Control-Allow-Credentials':"true",
		  'Access-Control-Allow-Methods':'POST, GET'
		}
	  })

	const res = await (<any>response.json())
	console.log(res)

	if(res && res.length > 1) {
        // Sync method might not work given data sets are several 100mb.
        // Should prob use the steam api https://csv.js.org/parse/api/stream/
        const rec = parse(res, {
            columns: true,
            skip_empty_lines: true
          })
          .reduce( (acc,val) => {

                const addr = {
                    street: val.vejnavn,
                    number: val.husnr,
                    post: val.postnr
                }

                if(!findByMatchingProperties(acc,addr)) acc.push(addr)
                
                return acc
            })  

            for (const address in rec) {
                models.building.create(address)
            }
        }
});