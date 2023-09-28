import { AddBuildingByKommuneKode } from '@teamkeel/sdk';
import fetch from "node-fetch";


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

    }

});