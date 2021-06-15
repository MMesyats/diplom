import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO, UpdateUserDTO, GivePermissionDTO } from './user.dto';
import { User, UserDocument } from './user.schema';
import { sign, verify } from 'jsonwebtoken';

const key = 'YgallZO3mK5yNFj75L3RVFhkmPptqcoN';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUser(id: string) {
    return await this.userModel.findOne({ firebaseId: id });
  }
  async getUserById(id: string) {
    return await this.userModel.findById(id);
  }

  async deleteDoctor(user_id: string, doctor_id: string) {
    const doctor = await this.getUserById(doctor_id);
    doctor.patients = doctor.patients.filter((id) => id.firebaseId != user_id);
    return this.userModel.updateOne({ _id: doctor.id }, doctor);
  }

  async createUser({ userData, ...user }: CreateUserDTO) {
    const createdUser = await this.userModel.create({
      ...user,
      firebaseId: userData.user_id,
    });
    return await createdUser.save();
  }

  async checkIfHasPermission(doctorId: string, patientId: string) {
    const doctor = await this.getUser(doctorId);
    const patient = await this.userModel.findById(patientId);
    return doctor.patients.includes(patient.id);
  }

  async updateUser({ userData, ...user }: UpdateUserDTO) {
    return await this.userModel.findOneAndUpdate(
      {
        firebaseId: userData.user_id,
      },
      user,
    );
  }

  async requestPermisson(id: string) {
    const { id: userId } = await this.getUser(id);
    const date = Date.now();

    return sign({ id: userId, iat: date }, key, {
      expiresIn: date + 60 * 5,
    });
  }

  async getDoctors(id: string) {
    const user = await this.getUser(id);
    return await this.userModel.find({
      patients: { $in: user.id },
      isDoctor: true,
    });
  }

  async getPatients(id: string) {
    const doctor = await this.getUser(id);
    if (!doctor.isDoctor)
      throw new HttpException('Bad Request', HttpStatus.UNAUTHORIZED);
    return await this.userModel.find({ _id: { $in: doctor.patients } });
  }

  async givePermission({ userData, permissionToken }: GivePermissionDTO) {
    try {
      const decodedToken = verify(permissionToken, key, {
        ignoreExpiration: false,
      }) as { id: string };

      const patient = await this.userModel.findById(decodedToken.id);

      const currentUser = await this.getUser(userData.user_id);
      if (!currentUser.isDoctor) throw Error();
      if (!currentUser.patients.includes(patient.id)) {
        currentUser.patients.push(patient.id);
        await currentUser.updateOne({
          patients: [...new Set(currentUser.patients)],
        });
      }

      return patient;
    } catch {
      throw new HttpException('Bad Request', HttpStatus.UNAUTHORIZED);
    }
  }
}
