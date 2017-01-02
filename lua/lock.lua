local KEY = KEYS[1]
local timestamp = tonumber(ARGV[1])
local expireat = tonumber(ARGV[2])

local res = redis.call('setnx', KEY, timestamp)
if res > 0 then
  redis.call('expire', KEY, expireat)
  return 1
else
  return 0
end
