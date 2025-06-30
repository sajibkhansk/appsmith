export default {
	myVar1: [],
	myVar2: {},
	myFun1 () {
		// write code here
		// this.myVar1 = [1,2,3]
	},
	getSafeUserIds() {
		// Handle null/undefined cases
		if (!activeUsers?.selectedOptionValues) return [];

		// Filter out any null/undefined values
		return activeUsers.selectedOptionValues
			.map(item => item?.value)
			.filter(value => value !== undefined && value !== null);
	}
}
