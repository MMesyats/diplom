import {
  Body,
  Controller,
  Delete,
  Get,
  HttpService,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDTO, UpdateUserDTO, GivePermissionDTO } from './user.dto';
import { IGetUser } from './user.interfaces';
import { UserService } from './user.service';
import * as admin from 'firebase-admin';
import { Response } from 'express';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private httpService: HttpService,
  ) {}

  @Get('/token/:id')
  @ApiParam({ name: 'id', example: '1' })
  async getTestToken(@Param('id') id: number, @Res() response: Response) {
    const customToken = await admin.auth().createCustomToken(`test-${id}`);
    const url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=AIzaSyA-B8ml3kb_jW5y3SiySA3yK7N-jQ2AuPM`;
    const data = {
      token: customToken,
      returnSecureToken: true,
    };

    const res = await this.httpService
      .post(url, JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      })
      .toPromise();
    response.cookie('token', res.data.idToken);
    response.send(res.data);
  }

  @Get('/doctors')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('token')
  async getDoctors(@Body() { userData: { user_id } }: IGetUser) {
    return this.userService.getDoctors(user_id);
  }

  @Get('/patients')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('token')
  async getPatients(@Body() { userData: { user_id } }: IGetUser) {
    return this.userService.getPatients(user_id);
  }

  @Get('/requestPermission')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('token')
  async requestPermission(@Body() { userData: { user_id } }: IGetUser) {
    const token = await this.userService.requestPermisson(user_id);
    return {
      permissionToken: token,
    };
  }

  @Post('/givePermission')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('token')
  async givePermission(@Body() body: GivePermissionDTO) {
    return this.userService.givePermission(body);
  }

  @Get()
  @ApiCookieAuth('token')
  @UseGuards(AuthGuard)
  async getUser(@Body() { userData: { user_id } }: IGetUser) {
    return await this.userService.getUser(user_id);
  }
  @Post()
  @UseGuards(AuthGuard)
  @ApiCookieAuth('token')
  async createUser(@Body() body: CreateUserDTO) {
    const user = await this.userService.createUser(body);
    return user;
  }

  @Delete('/doctors/:id')
  @UseGuards(AuthGuard)
  @ApiCookieAuth('token')
  async deleteDoctor(
    @Param('id') id,
    @Body() { userData: { user_id } }: IGetUser,
  ) {
    return await this.userService.deleteDoctor(user_id, id);
  }

  @Put()
  @UseGuards(AuthGuard)
  @ApiCookieAuth('token')
  async updateUser(@Body() body: UpdateUserDTO) {
    return await this.userService.updateUser(body);
  }
}
