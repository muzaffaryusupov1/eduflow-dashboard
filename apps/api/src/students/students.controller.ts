import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateStudentDto } from './dto/create.student.dto'
import { GetStudentsDto } from './dto/get.students.dto'
import { UpdateStudentDto } from './dto/update.student.dto'
import { StudentsService } from './students.service'

@ApiTags('students')
@Controller()
export class StudentsController{
  constructor(private readonly studentService: StudentsService){}

  @Get('students')
  getStudents(@Query() query: GetStudentsDto){
    return this.studentService.getStudents(query)
  }

  @Post('students')
  async createStudent(@Body() dto:CreateStudentDto ){
    return await this.studentService.createStudent(dto)
  }

  @Patch('students/:id')
  async updateStudent(@Param('id') id: string, @Body() dto: UpdateStudentDto){
    return await this.studentService.updateStudent(id, dto)
  }

  @Get('students/:id')
  async getStudent(@Param('id') id: string){
    return await this.studentService.getStudent(id)
  }
}
