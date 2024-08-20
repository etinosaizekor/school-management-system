import { Dayjs } from "dayjs";

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  if (date instanceof Date && !isNaN(date.getTime())) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return "";
};
/**
 * Calculates the age given a date of birth.
 *
 * @param dateOfBirth - The date of birth as a Date object.
 * @returns The age in years.
 */
export const calculateAge = (dateString: string) => {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
