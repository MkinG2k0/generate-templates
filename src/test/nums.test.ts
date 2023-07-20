function twoSum(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    const number = nums[i]

    for (let a = i + 1; a < nums.length; a++) {
      const nextNumber = nums[a]
      const res = number + nextNumber

      if (res === target) {
        return [number, nextNumber]
      }
    }
  }
  return []
}

test('ReadTemplates args', async () => {
  console.log(twoSum([2, 7, 11, 15], 9))
  console.log(twoSum([3, 2, 4], 6))
  console.log(twoSum([3, 3], 6))
})
