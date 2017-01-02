local KEY = KEYS[1]
local timestamp = tonumber(ARGV[1])
local expire = tonumber(ARGV[2])

local res = redis.call('setnx', KEY, timestamp)
if res > 0 then
  redis.call('expire', KEY, expire)
  return 1
else
  return 0
end
