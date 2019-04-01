
# Rule Code

![\[](https://hstatic.net/0/0/global/design/haravan/h_haravan_home/images/img_commont/favicon.png) [ [Haravan|Tech App ]


Một số rule để giúp source code có hệ thống và dễ quản lý hơn.
#### 1. Chung
   
 - Giữ đúng hoàn toàn format, structure và eslint của bộ source không tự tiện làm khác đi . Nếu có bug hoặc những bất tiện trong quá trình code có thể để xuất với leader hoặc người chịu trách nhiệm cải tiến
 - Trước khi thêm helper, bussiness phải kiểm tra kĩ đã có ai viết chưa nếu có ưu tiên customize cái đang có chỉ viết mới nếu không thể customize (nếu viết trùng người viết sau phải chịu trách nhiệm remove helper, bussiness mình đã viết và chuyển sang cái đã có)
 - Khi viết 1 hàm helper thì những hàm có INPUT là gì thì sẽ để ở các file chuyên xử lý cho nó (trừ các hàm xử lý ngày tháng)
 - Đối với các trường hợp export function bằng cách gắn các function vào 1 object thì chú ý đảm bảo tên exports và tên function giống nhau
 - Đặt tên biến theo quy chuẩn cammelCase
 - Khi đặt biến hoặc hàm dùng trong nội hàm không export thì phải đặt với tiền tố là dấu gạch dưới ( _ )
 - Đặt tên biến import = đúng cái path của file
  1.  với bussiness: admin/order/bussiness/created = AdminOrderCreted
  2.  còn lại : model/order = ModelOrder


#### 2. Model

| Rule | Mô tả |
| ------ | ------ |
| Có ít nhất 1 BuildQuery function| Xử lý dữ liệu truyền vào trước khi đưa xuống mongo  |
| Có ít nhất 1 PreInsert function| Xử lý  trước khi insert dùng remove các dữ liệu không được insert |
| Có ít nhất 1 PreUpdate function | Xử lý  trước khi update dùng remove các dữ liệu không được update |

#### 3. Controller

- object mẫu search `{filter: {'key': 'value'[string|number]}` value chỉ được chuỗi hoặc số
- Tên class controller luôn đặt với hậu tố Controller
#### 4. response
 | Action      | response | status |
 | ----------- | -------- | ------ |
 | Thêm mới    | trả về object mới vừa thêm | 200 |
 | Cập nhật    | trả về object vừa cập | 200 |
 | Xóa         | trả về empty | 204 |
 | Chi tiết    | trả về object tìm | 200 |
 | Danh sách   | trả về object {items: [], limit: number, page: number, total: number} | 200 |