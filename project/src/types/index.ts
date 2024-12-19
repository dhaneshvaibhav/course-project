export interface CourseType {
  id: string;
  name: string;
  created_at: string;
}

export interface Course {
  id: string;
  name: string;
  created_at: string;
}

export interface CourseOffering {
  id: string;
  course_id: string;
  course_type_id: string;
  created_at: string;
  course?: Course;
  course_type?: CourseType;
}

export interface Registration {
  id: string;
  course_offering_id: string;
  student_name: string;
  email: string;
  created_at: string;
  course_offering?: CourseOffering;
}