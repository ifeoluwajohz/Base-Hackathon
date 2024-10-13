Endpoint

POST https://base-hackathon-1.onrender.com/register  POST Request for registering a user 
note: Ensure to store wallet_address to local storage as wallet_address

Example Request
json
{
  "wallet_address": "0x1234567890abcdef"
}
Responses
200 OK: Successfully registered the user. Returns the user's wallet address as cookies And Redirects to the user Dashboard.



Endpoint

GET https://base-hackathon-1.onrender.com/search_job/wallet_address  GET Request for fetching a related job in the market 
note: Jobs will be fetched based on employee's Job experience and bio

Example Request
json
{
  "wallet_address": "0x1234567890abcdef"
}
Responses
200 OK: 
res.status(200).json({
  message: 'Related jobs found',
  jobs: relatedJobs
});



Endpoint

POST https://base-hackathon-1.onrender.com/new_job/wallet_address  POST Request for posting a new job on the market job listing
note: You must have an employeer role to post a job on the market listing

Example Request
json
{
  "salery" :"2000",
  "title" : "Web Developer",
  "description" : "Web Developer with experience with typescript and graphql "
}
Responses
200 OK: 
res.status(200).json({
  message: 'Job posted successfully',
  job: newJob
});


Endpoint

GET https://base-hackathon-1.onrender.com/user/wallet_address  GET Request for getting a user infomation 

Example Request
json
{
  "wallet_address": "0x1234567890abcdef"
}
Responses

Example Request
json
{
  "wallet_address" :"2000bdjibw",
  "fullname" : "Hicode morenike",
  "bio" : "i am grown ass guy with experience with typescript and graphql "
  and so on 
}

<!-- Endpoint

PATCH https://base-hackathon-1.onrender.com/update_job/wallet_address  PATCH Request for patching a new job an employer posted
note: You must have an employeer role to post a job on the market listing

Example Request
json
{
  "salery" :"2000",
  "title" : "Web Developer",
  "description" : "Web Developer with experience with typescript and graphql "
}
Responses
200 OK: 
res.status(200).json({
  message: 'Job posted successfully',
  job: newJob
}); -->


Pls Don't mind my writing lolz
Feel free to ask me question
