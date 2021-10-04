export interface menu {
    name: string;
    redirectTo: string;
}

/** list of menus */
export const menus: menu[] = [
    {
        name: "My_orders",
        redirectTo: "/home"
    },
    {
        name: "my_products",
        redirectTo: "/products"
    },
    // {
    //     name: "DIRECCIONES",
    //     redirectTo: "/address"
    // },
    // {
    //     name: "Profile_edit",
    //     redirectTo: "/profile-edit"
    // }
]

export interface language {
    name: string;
    value: string;
}

/** list of Language */
export const Languages: language[] = [
    {
        name: "English",
        value: "english"
    },
    {
        name: "Spanish",
        value: "spanish"
    }
]