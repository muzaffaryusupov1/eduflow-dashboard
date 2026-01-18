import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateStudentDto } from './dto/create.student.dto'
import { StudentsService } from './students.service'

@ApiTags('students')
@Controller()
export class StudentsController{
  constructor(private readonly studentService: StudentsService){}

  @Get('students')
  getStudents(){
    return {
      "data": [],
      "": {
        "total": 0,
        "page": 1,
        "limit": 10
      }
    }
  }

  @Post('students')
  async createStudent(@Body() dto:CreateStudentDto ){
    return await this.studentService.createStudent(dto)
  }
}
