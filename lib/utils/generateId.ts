export const generateStudentId = (): string => {
  // Tạo ID theo format STU + timestamp + random
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `STU${timestamp}${random}`.toUpperCase();
};

export const generateTeacherId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `TCH${timestamp}${random}`.toUpperCase();
};

export const generateSubjectId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `SUB${timestamp}${random}`.toUpperCase();
};
