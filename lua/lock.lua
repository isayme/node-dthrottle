local timestamp = tonumber(ARGV[1])
local expire = tonumber(ARGV[2])

local res = redis.call('setnx', KEYS[1], timestamp)
if res > 0 then
  redis.call('expire', KEYS[1], expire)
  return 1
else
  return 0
end
