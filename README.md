sound-bored
===========

## TODO
- Session management
- save soundboards to database
- share
- size limits
- upload progress
- optimize vizualizations (only render if playing, use canvas)
- csrf protection
- auto delete batch script

- Key mappings
- load sounds from server
- sample pad options: gain, name, key, etc
- effects
- highlight playing sound
- error checking
- firefox and safari support


Save sampler:
- separate out all the client-only data from the saveable model attributes
- call save() on the sampler model
- create a record in redis for sampler meta-data...
- respond with unique access id
- do a batch save for all sample meta-data... respond
- loop thru each sample sound file and upload them all... respond

fetch sampler: 
- download and instantiate all the meta data
- fetch all the acutal audio files and initialize

