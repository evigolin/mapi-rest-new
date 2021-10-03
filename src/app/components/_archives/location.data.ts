export interface Municipality {
    name: string;
    value: string;
}

export interface Department {
    name: string;
    value: string;
    Municipalities: Municipality[];
}

/** list of Departaments */
export const Departments: Department[] = [
    {
        name: 'Valle',
        value: 'Valle',
        Municipalities: [
            {
                name: 'Tulua',
                value: 'Tulua'
            },
            {
                name: 'San Pedro',
                value: 'San Pedro'
            },
            {
                name: 'Buga',
                value: 'Buga'
            },
            {
                name: 'Andalucia-Bugalagrande',
                value: 'Andalucia-Bugalagrande'
            },
            {
                name: 'Zarzal-Roldanillo',
                value: 'Zarzal-Roldanillo'
            },
        ]
    },
    {
        name: 'Antioquia',
        value: 'Antioquia',
        Municipalities: [
            {
                name: 'Itagüí',
                value: 'Itagüí'
            },
            {
                name: 'Bello ',
                value: 'Bello '
            }
        ]
    },
    {
        name: 'Cordoba',
        value: 'Cordoba',
        Municipalities: [
            {
                name: 'Monteria',
                value: 'Monteria'
            }
        ]
    },
];