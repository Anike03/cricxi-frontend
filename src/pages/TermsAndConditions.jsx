import { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text3D, Float } from '@react-three/drei'
import { motion } from 'framer-motion'
import styled from 'styled-components'

const TermsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #fff;
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`

const Section = styled(motion.div)`
  background: rgba(0, 0, 0, 0.6);
  border-radius: 15px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  cursor: pointer;
  transition: all 0.3s ease;
  line-height: 1.6;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
  }
`

const SectionContent = styled(motion.div)`
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 1rem;
`

const RotatingCube = ({ position, color }) => {
  const meshRef = useRef()
  
  useFrame(() => {
    meshRef.current.rotation.x += 0.01
    meshRef.current.rotation.y += 0.01
  })
  
  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

const InteractiveText = ({ content, position }) => {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.5}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
        position={position}
      >
        {content}
        <meshStandardMaterial color="#ffffff" />
      </Text3D>
    </Float>
  )
}

export default function TermsAndConditions() {
  const [activeSections, setActiveSections] = useState([])
  
  const toggleSection = (index) => {
    setActiveSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    )
  }
  
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: (
        <>
          <p>By accessing or using the Dream11 fantasy sports platform ("Platform"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to all of these Terms, you must not use the Platform.</p>
          <p>We may modify these Terms at any time, and such modifications shall be effective immediately upon posting on the Platform. Your continued use of the Platform after such modifications constitutes your acceptance of the modified Terms.</p>
        </>
      )
    },
    {
      title: "2. Eligibility",
      content: (
        <>
          <p>To use the Platform, you must:</p>
          <ul>
            <li>Be at least 18 years of age</li>
            <li>Be a resident of India</li>
            <li>Not be a resident of Assam, Odisha, Telangana, Nagaland, or Sikkim where paid contests are prohibited</li>
            <li>Not be restricted by any legal authority from using such platforms</li>
          </ul>
          <p>You may only have one account, and you are prohibited from creating or using additional accounts.</p>
        </>
      )
    },
    {
      title: "3. Account Registration",
      content: (
        <>
          <p>To access certain features of the Platform, you must register for an account. When registering, you agree to:</p>
          <ul>
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security of your password and accept all risks of unauthorized access</li>
            <li>Notify us immediately if you discover or suspect any security breaches</li>
          </ul>
        </>
      )
    },
    {
      title: "4. Fantasy Sports Rules",
      content: (
        <>
          <p>The Platform allows you to create fantasy sports teams and participate in contests based on real-world sports events. Key rules include:</p>
          <ul>
            <li>Teams must be created before the deadline for each match/event</li>
            <li>Player selections are subject to salary cap constraints</li>
            <li>Points are awarded based on actual player performance in real-world events</li>
            <li>Contest results are final and binding</li>
          </ul>
        </>
      )
    },
    {
      title: "5. Fees and Payments",
      content: (
        <>
          <p>Participation in certain contests may require payment of an entry fee. You agree to:</p>
          <ul>
            <li>Pay all fees and applicable taxes</li>
            <li>Not dispute any payments made through the Platform</li>
            <li>Accept that all transactions are final with no refunds except as required by law</li>
          </ul>
          <p>Winnings will be credited to your account and may be withdrawn subject to verification and applicable laws.</p>
        </>
      )
    },
    {
      title: "6. User Conduct",
      content: (
        <>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Platform for any unlawful purpose</li>
            <li>Post or transmit any harmful, threatening, abusive, or offensive material</li>
            <li>Attempt to gain unauthorized access to the Platform or other users' accounts</li>
            <li>Use any automated means to interact with the Platform</li>
            <li>Engage in any fraudulent activity including but not limited to match-fixing</li>
          </ul>
        </>
      )
    },
    {
      title: "7. Intellectual Property",
      content: (
        <>
          <p>The Platform and its original content, features, and functionality are owned by Dream11 and are protected by international copyright, trademark, and other intellectual property laws.</p>
          <p>You are granted a limited, non-exclusive, non-transferable license to access and use the Platform for personal, non-commercial use.</p>
        </>
      )
    },
    {
      title: "8. Termination",
      content: (
        <>
          <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.</p>
          <p>Upon termination, your right to use the Platform will immediately cease. If you wish to terminate your account, you may simply discontinue using the Platform.</p>
        </>
      )
    },
    {
      title: "9. Limitation of Liability",
      content: (
        <>
          <p>In no event shall Dream11, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:</p>
          <ul>
            <li>Your access to or use of or inability to access or use the Platform</li>
            <li>Any conduct or content of any third party on the Platform</li>
            <li>Any content obtained from the Platform</li>
            <li>Unauthorized access, use or alteration of your transmissions or content</li>
          </ul>
        </>
      )
    },
    {
      title: "10. Governing Law",
      content: (
        <>
          <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
          <p>Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in Mumbai, Maharashtra.</p>
        </>
      )
    },
    {
      title: "11. Contact Information",
      content: (
        <>
          <p>For any questions about these Terms, please contact us:</p>
          <ul>
            <li>By email: legal@dream11.com</li>
            <li>By visiting this page on our website: www.dream11.com/contact</li>
            <li>By mail: Dream11 Fantasy Sports Pvt. Ltd., 601-602, 6th Floor, B-Wing, Marathon Futurex, N.M. Joshi Marg, Lower Parel, Mumbai - 400013, India</li>
          </ul>
        </>
      )
    }
  ]
  
  return (
    <TermsContainer>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>Terms and Conditions</h1>
      
      <div style={{ height: '500px', position: 'relative' }}>
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <RotatingCube position={[-2, 0, 0]} color="#ff5e62" />
          <RotatingCube position={[2, 0, 0]} color="#4facfe" />
          <InteractiveText content="Terms & Conditions" position={[0, 2, 0]} />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>
      
      {sections.map((section, index) => (
        <Section
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          onClick={() => toggleSection(index)}
        >
          <h2 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {section.title}
            <span>{activeSections.includes(index) ? '−' : '+'}</span>
          </h2>
          {activeSections.includes(index) && (
            <SectionContent
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              {section.content}
            </SectionContent>
          )}
        </Section>
      ))}
    </TermsContainer>
  )
}