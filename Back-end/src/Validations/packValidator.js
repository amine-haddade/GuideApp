// Set a date that is 15 days in the future
const getMinDate = () => {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 15);
  return minDate;
};

// Check if the entered date if greater or equal to the min date ( defined by the getMinDate function )
const dateValidator = (value) => {
  return value >= getMinDate();
};

// Check if the entered date ( End date ) is greater or equal to the start date
function checkEndDate(endDate) {
  if (this.startDate && endDate) {
    return endDate >= this.startDate;
  }
  return true;
}

export {
    dateValidator,
    checkEndDate
};