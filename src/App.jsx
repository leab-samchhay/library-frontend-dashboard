import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import HomePage from './pages/HomePage'
import MainLayout from './layout/MainLayout'
import MemberPage from './pages/member/MemberList'
import MemberCreate from './pages/member/MemberCreate'
import AuthorsList from './pages/authors/AuthorsList'
import AuthorsCreate from './pages/authors/AuthorsCreate'
import CategoryList from './pages/category/CategoryList'
import CategoryCreate from './pages/category/CategoryCreate'
import AuthorBookList from './pages/AuthorBook/AuthorBookList'
import AuthorBookForm from './pages/AuthorBook/AuthorBookForm'
import PublishersList from './pages/publishers/PublishersList'
import PublishersCreate from './pages/publishers/PublishersCreate'
import LoansList from './pages/loans/LoansList'
import LoansCreate from './pages/loans/LoansCreate'
import BookList from './pages/books/BookList'
import BookCreate from './pages/books/BookCreate'
import BookCopyList from './pages/bookcopy/BookCopyList'
import BookCopyCreate from './pages/bookcopy/BookCopyCreate'
import LoansDetailList from './pages/loansDetail/LoansDetailList'
import LoansDetailCreate from './pages/loansDetail/LoansDetailCreate'
import BookReturnList from './pages/return/BookReturnList'
import ReturnCreate from './pages/return/ReturnCreate'
import PageLoansAndReturn from './pages/loansAndReturn/Layout'
import LoansBook from './pages/loansAndReturn/LoansBook'
import ReturnBook from './pages/loansAndReturn/ReturnBook'
import AddNewMember from './pages/loansAndReturn/AddNewMember'
import HomeLoan from './pages/loansAndReturn/HomeLoan'
import FineList from './pages/fines/FineList'
import FinesCreate from './pages/fines/FinesCreate'
import FinesPaymentList from './pages/finesPayment/FinesPaymentList'
import FinesPaymentCreate from './pages/finesPayment/FinesPaymentCreate'
import CreatePayment from './pages/loansAndReturn/CreatePayment'
import UserList from './pages/users/UserList'
import UserForm from './pages/users/UserForm'
import PermissionPage from './pages/users/PermissionPage'
import Login from './pages/Auth/Login'
import Unauthorized from './pages/Unauthorized'
import DefaultDashboard from './pages/DefaultDashboard'
import ProtectedRoute from './components/ProtectedRoute'

// បើ User មានសិទ្ធិ dashboard.view នឹងបង្ហាញ HomePage (របាយការណ៍)
// បើគ្មានសិទ្ធិ dashboard.view ទេ នឹងបង្ហាញ DefaultDashboard (នៅតែឃើញផ្ទាំង Dashboard ដដែល តែមិនបង្ហាញ HomePage)
const DashboardView = () => {
  const { user } = useSelector(state => state.auth);
  const hasDashboardPermission = user?.permissions && user.permissions.includes('dashboard.view');

  if (!hasDashboardPermission) {
    return <DefaultDashboard />;
  }

  return <HomePage />;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* បើកមកដំបូងគេ (Root /) ឲ្យលោតទៅ /login តែម្តង */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          <Route path="/loansReturn" element={
            <ProtectedRoute permission="loans_return.view">
              <PageLoansAndReturn/>
            </ProtectedRoute>
          }>
            <Route index element={<HomeLoan/>}/>
            <Route path="/loansReturn/homeLoan" element={<HomeLoan/>}/>
            <Route path="/loansReturn/loansBook" element={<LoansBook/>}/>
            <Route path="/loansReturn/returnBook" element={<ReturnBook/>}/>
            <Route path="/loansReturn/loansReturn/addNewMember" element={<AddNewMember/>}/>
            <Route path="/loansReturn/paymentLate" element={<CreatePayment/>}/>
          </Route>
          
          <Route element={<MainLayout/>}>
            {/* បង្ហាញផ្ទាំង Dashboard ជានិច្ច តែលាក់ HomePage ប្រសិនបើគ្មានសិទ្ធិ */}
            <Route path="/home" element={<DashboardView/>} />

            <Route path="/category" element={<ProtectedRoute permission="category.view"><CategoryList/></ProtectedRoute>} />
            <Route path="/category/create" element={<ProtectedRoute permission="category.create"><CategoryCreate/></ProtectedRoute>} />
            <Route path="/category/edite/:id" element={<ProtectedRoute permission="category.edit"><CategoryCreate/></ProtectedRoute>} />

            <Route path="/authors" element={<ProtectedRoute permission="authors.view"><AuthorsList/></ProtectedRoute>} />
            <Route path="/authors/create" element={<ProtectedRoute permission="authors.create"><AuthorsCreate/></ProtectedRoute>} />
            <Route path="/authors/edite/:id" element={<ProtectedRoute permission="authors.edit"><AuthorsCreate/></ProtectedRoute>} />

            <Route path="/authorBooks" element={<ProtectedRoute permission="author_books.view"><AuthorBookList/></ProtectedRoute>} />
            <Route path="/authorBooks/create" element={<ProtectedRoute permission="author_books.create"><AuthorBookForm/></ProtectedRoute>} />
            <Route path="/authorBooks/edite/:id" element={<ProtectedRoute permission="author_books.edit"><AuthorBookForm/></ProtectedRoute>} />

            <Route path="/publishers" element={<ProtectedRoute permission="publishers.view"><PublishersList/></ProtectedRoute>} />
            <Route path="/publishers/create" element={<ProtectedRoute permission="publishers.create"><PublishersCreate/></ProtectedRoute>} />
            <Route path="/publishers/edite/:id" element={<ProtectedRoute permission="publishers.edit"><PublishersCreate/></ProtectedRoute>} />

            <Route path="/member" element={<ProtectedRoute permission="member.view"><MemberPage/></ProtectedRoute>} />
            <Route path="/member/create" element={<ProtectedRoute permission="member.create"><MemberCreate/></ProtectedRoute>} />
            <Route path="/member/edite/:id" element={<ProtectedRoute permission="member.edit"><MemberCreate/></ProtectedRoute>} />

            <Route path="/loans" element={<ProtectedRoute permission="loans.view"><LoansList/></ProtectedRoute>} />
            <Route path="/loans/create" element={<ProtectedRoute permission="loans.create"><LoansCreate/></ProtectedRoute>} />
            <Route path="/loans/edite/:id" element={<ProtectedRoute permission="loans.edit"><LoansCreate/></ProtectedRoute>} />

            <Route path="/books" element={<ProtectedRoute permission="books.view"><BookList/></ProtectedRoute>} />
            <Route path="/books/create" element={<ProtectedRoute permission="books.create"><BookCreate/></ProtectedRoute>} />
            <Route path="/books/edite/:id" element={<ProtectedRoute permission="books.edit"><BookCreate/></ProtectedRoute>} />

            <Route path="/bookcopy" element={<ProtectedRoute permission="book_copies.view"><BookCopyList/></ProtectedRoute>} />
            <Route path="/bookcopy/create" element={<ProtectedRoute permission="book_copies.create"><BookCopyCreate/></ProtectedRoute>} />
            <Route path="/bookcopy/edite/:id" element={<ProtectedRoute permission="book_copies.edit"><BookCopyCreate/></ProtectedRoute>} />

            <Route path="/bookReturn" element={<ProtectedRoute permission="book_return.view"><BookReturnList/></ProtectedRoute>} />
            <Route path="/bookReturn/create" element={<ProtectedRoute permission="book_return.create"><ReturnCreate/></ProtectedRoute>} />
            <Route path="/bookReturn/edite/:id" element={<ProtectedRoute permission="book_return.edit"><ReturnCreate/></ProtectedRoute>} />

            <Route path="/loansDetail" element={<ProtectedRoute permission="loans_detail.view"><LoansDetailList/></ProtectedRoute>} />
            <Route path="/loansDetail/create" element={<ProtectedRoute permission="loans_detail.create"><LoansDetailCreate/></ProtectedRoute>} />
            <Route path="/loansDetail/edite/:id" element={<ProtectedRoute permission="loans_detail.edit"><LoansDetailCreate/></ProtectedRoute>} />

            <Route path="/fines" element={<ProtectedRoute permission="fines.view"><FineList/></ProtectedRoute>} />
            <Route path="/fines/create" element={<ProtectedRoute permission="fines.create"><FinesCreate/></ProtectedRoute>} />
            <Route path="/fines/edit/:id" element={<ProtectedRoute permission="fines.edit"><FinesCreate/></ProtectedRoute>} />

            <Route path="/finesPayment" element={<ProtectedRoute permission="fine_payments.view"><FinesPaymentList/></ProtectedRoute>} />
            <Route path="/finesPayment/create" element={<ProtectedRoute permission="fine_payments.create"><FinesPaymentCreate/></ProtectedRoute>} />
            <Route path="/finesPayment/edit/:id" element={<ProtectedRoute permission="fine_payments.edit"><FinesPaymentCreate/></ProtectedRoute>} />

            <Route path="/user" element={<ProtectedRoute permission="users.view"><UserList/></ProtectedRoute>} />
            <Route path="/user/create" element={<ProtectedRoute permission="users.create"><UserForm/></ProtectedRoute>} />
            <Route path="/user/edite/:id" element={<ProtectedRoute permission="users.edit"><UserForm/></ProtectedRoute>} />
            <Route path="/user/permission/:id" element={<ProtectedRoute permission="users.edit"><PermissionPage/></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
