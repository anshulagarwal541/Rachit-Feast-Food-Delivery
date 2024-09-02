import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PaidIcon from '@mui/icons-material/Paid';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import NotificationsIcon from '@mui/icons-material/Notifications';

export const home = [
    {
        icon: HomeIcon,
        name: "Home",
        to:"/admin"
    },
]

export const general = [
    {
        icon: MarkunreadIcon,
        name: "Vendors",
        to:"/admin/vendors"
    },
    {
        icon: FamilyRestroomIcon,
        name: "Restaurants",
        to:"/admin/restaurants"
    },
    {
        icon: PersonIcon,
        name: "User",
        to:"/admin/users"
    },
    {
        icon: DirectionsBikeIcon,
        name: "Riders",
        to:"/admin/riders"
    }
]

export const management = [
    {
        icon: LocalOfferIcon,
        name: "Coupons",
        to:"/admin/coupons"
    },
    {
        icon: PaidIcon,
        name: "Tipping",
        to:"/admin/tippings"
    },
    {
        icon: LocalShippingIcon,
        name: "Dispatch",
        to:"/admin/dispatch"
    },
    {
        icon: NotificationsIcon,
        name: "Comission Rates",
        to:"/admin/comissionRates"
    },
    {
        icon: NotificationsIcon,
        name: "Withdrawal",
        to:"/admin/withdrawlRequest"
    }
]