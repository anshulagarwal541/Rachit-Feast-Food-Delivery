import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import CategoryIcon from '@mui/icons-material/Category';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import GradeIcon from '@mui/icons-material/Grade';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export const home = [
    {
        name: "Dashboard",
        to: "",
        icon: DashboardIcon
    },
    {
        name: "Profile",
        to: "profile",
        icon: PersonIcon
    }
]


export const management = [
    {
        name: "Food",
        to: "food",
        icon: LocalPizzaIcon
    },
    {
        name: "Category",
        to: "category",
        icon: CategoryIcon
    },
    {
        name: "Orders",
        to: "orders",
        icon: LocalShippingIcon
    },
    {
        name: "Coupons",
        to: "coupons",
        icon: LocalOfferIcon
    },
    {
        name: "Ratings",
        to: "ratings",
        icon: GradeIcon
    },
    {
        name: "Timings",
        to: "timings",
        icon: AccessTimeFilledIcon
    }
]