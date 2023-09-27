import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { User } from './Models/User.js';

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/QLKS')
      .then(() => console.log('Connected!'))
      .catch((err) => console.error(err));

app.route('/')
      .get(function (req, res) {
            res.send('Hello World!');
      })

app.route("/users")
      .get(async function (req, res) {
            try {
                  const users = await User.find();
                  res.json(users.name);
            } catch (err) {
                  console.log('====================================');
                  console.log(err);
                  console.log('====================================');
            }
      })
      .post(async function (req, res) {
            try {
                  // Lấy thông tin của người dùng
                  const { name, phone, email, address, gender } = req.query;
                  const newUser = new User({
                        name,
                        phone,
                        email,
                        address,
                        gender
                  });
                  const savedUser = await newUser.save();
                  res.status(200).json(savedUser);
            } catch (err) {
                  console.log('====================================');
                  console.log(err);
                  console.log('====================================');
            }
      })
      .put(async function (req, res) {
            try {
                  // Lấy thông tin của người dùng cần cập nhật
                  const { name, phone, email, address, gender } = req.query;

                  // Tìm người dùng theo name (hoặc một trường duy nhất để xác định người dùng cần cập nhật)
                  const userToUpdate = await User.findOne({ phone });

                  // Kiểm tra xem người dùng có tồn tại không
                  if (!userToUpdate) {
                        return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
                  }

                  // Cập nhật thông tin người dùng
                  userToUpdate.name = name;
                  userToUpdate.phone = phone;
                  userToUpdate.email = email;
                  userToUpdate.address = address;
                  userToUpdate.gender = gender;

                  // Lưu thông tin người dùng đã cập nhật vào cơ sở dữ liệu
                  const updatedUser = await userToUpdate.save();

                  res.status(200).json(updatedUser);
            } catch (err) {
                  console.log('====================================');
                  console.error(err);
                  console.log('====================================');
                  res.status(500).json({ error: 'Lỗi khi cập nhật người dùng.' });
            }
      })
      .delete(async function (req, res) {
            try {
                  // Lấy thông tin của người dùng cần xóa
                  const { phone } = req.query;

                  // Tìm người dùng theo name (hoặc một trường duy nhất để xác định người dùng cần xóa)
                  const userToDelete = await User.findOne({ phone });

                  // Kiểm tra xem người dùng có tồn tại không
                  if (!userToDelete) {
                        return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
                  }

                  // Xóa người dùng khỏi cơ sở dữ liệu
                  await userToDelete.deleteOne();

                  res.status(200).json({ message: 'Người dùng đã được xóa thành công.' });
            } catch (err) {
                  console.log('====================================');
                  console.error(err);
                  console.log('====================================');
                  res.status(500).json({ error: 'Lỗi khi xóa người dùng.' });
            }
      });

app.listen(3000, () => console.log('Server started on port 3000'));