const { User, Store, Rating } = require('./models');

async function seed() {
  try {
    // Clear all existing data
    console.log('Clearing existing data...');
    await Rating.destroy({ where: {}, truncate: true, cascade: true });
    await Store.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: {}, truncate: true, cascade: true });
    console.log('Existing data cleared!');

    // Create admin user
    const admin = await User.create({
      name: 'Akhilesh Prasad Bajpai',
      email: 'admin@example.com',
      password: 'Admin@123',
      address: 'Bhagya Nagar Old Ausa Road Latur',
      role: 'admin'
    });
    console.log('Admin user created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: Admin@123');

    // Create store owners and stores
    const storeOwnerData = [
      {
        name: 'Arjun Subramanian Iyer Jr.',
        email: 'arjun.iyer@example.com',
        password: 'Owner@123',
        address: '456 Anna Salai, Chennai, Tamil Nadu 600002',
        store: {
          name: 'Balaji Woodlands Vegetarian Restaurant',
          email: 'info@balajiwoodlands.com',
          address: '789 T Nagar, Chennai, Tamil Nadu 600017'
        }
      },
      {
        name: 'Priya Mohan Patel-Gandhi',
        email: 'priya.patel@example.com',
        password: 'Owner@123',
        address: '321 Law Garden Road, Ahmedabad, Gujarat 380006',
        store: {
          name: 'Vijay Electronic Mega Appliances Hub',
          email: 'support@vijayelectronics.com',
          address: '654 C G Road, Ahmedabad, Gujarat 380009'
        }
      },
      {
        name: 'Anand Vishwanath Kulkarni III',
        email: 'anand.kulkarni@example.com',
        password: 'Owner@123',
        address: '987 FC Road, Pune, Maharashtra 411004',
        store: {
          name: 'Royal Fabindia Handloom Clothing Emporium',
          email: 'hello@royalfabindia.com',
          address: '123 Laxmi Road, Pune, Maharashtra 411002'
        }
      },
      {
        name: 'Neha Rajesh Deshpande-Patil',
        email: 'neha.deshpande@example.com',
        password: 'Owner@123',
        address: '456 Brigade Road, Bengaluru, Karnataka 560025',
        store: {
          name: 'Sapna Book House Premium Literature Store',
          email: 'books@sapnabookhouse.com',
          address: '789 Residency Road, Bengaluru, Karnataka 560025'
        }
      },
      {
        name: 'Rahul Sanjay Mehta-Sharma',
        email: 'rahul.mehta@example.com',
        password: 'Owner@123',
        address: '321 Linking Road, Mumbai, Maharashtra 400050',
        store: {
          name: 'Fitness First Pro Gym Equipment Store',
          email: 'sales@fitnessfirstpro.com',
          address: '654 Bandra West, Mumbai, Maharashtra 400050'
        }
      },
      {
        name: 'Anjali Prasad Nair-Krishnan',
        email: 'anjali.nair@example.com',
        password: 'Owner@123',
        address: '987 MG Road, Kochi, Kerala 682011',
        store: {
          name: 'Indian Coffee House Traditional Cafe',
          email: 'hello@indiancoffeehouse.com',
          address: '123 Marine Drive, Kochi, Kerala 682011'
        }
      }
    ];

    const createdOwners = [];
    for (const ownerInfo of storeOwnerData) {
      const owner = await User.create({
        name: ownerInfo.name,
        email: ownerInfo.email,
        password: ownerInfo.password,
        address: ownerInfo.address,
        role: 'store_owner'
      });
      createdOwners.push(owner);
      console.log(`Store owner ${ownerInfo.name} created!`);

      await Store.create({
        name: ownerInfo.store.name,
        email: ownerInfo.store.email,
        address: ownerInfo.store.address,
        owner_id: owner.id
      });
      console.log(`Store "${ownerInfo.store.name}" created!`);
    }

    // Create normal users
    const normalUserData = [
      {
        name: 'Suresh Kumar Reddy-Gupta',
        email: 'suresh.reddy@example.com',
        password: 'User@123',
        address: '111 Banjara Hills, Hyderabad, Telangana 500034'
      },
      {
        name: 'Meera Manohar Joshi-Tiwari',
        email: 'meera.joshi@example.com',
        password: 'User@123',
        address: '222 Peddar Road, Mumbai, Maharashtra 400026'
      }
    ];

    for (const userInfo of normalUserData) {
      await User.create({
        name: userInfo.name,
        email: userInfo.email,
        password: userInfo.password,
        address: userInfo.address,
        role: 'normal_user'
      });
      console.log(`Normal user ${userInfo.name} created!`);
    }

    console.log('Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
