import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html, useGLTF } from '@react-three/drei'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import { _useEffect, useRef } from 'react'

const PrivacyPolicyContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #fff;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`

const PolicyContent = styled(motion.div)`
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  line-height: 1.6;
`

const Section = styled(motion.div)`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`

const ScrollIndicator = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 1.5rem;
  opacity: 0.7;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Model = () => {
  const { scene } = useGLTF('/privacy_shield.glb') // Replace with your actual model
  return <primitive object={scene} scale={0.5} />
}

export default function PrivacyPolicy() {
  const contentRef = useRef(null)
  
  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <PrivacyPolicyContainer>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Privacy Policy</h1>
      <p style={{ opacity: 0.8, marginBottom: '2rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
      
      <div style={{ height: '400px', position: 'relative' }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Model />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
        </Canvas>
      </div>

      <ScrollIndicator
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        onClick={scrollToContent}
      >
        <span>↓</span>
        <span style={{ fontSize: '0.8rem' }}>Scroll Down</span>
      </ScrollIndicator>

      <PolicyContent
        ref={contentRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Section>
          <h2>1. Introduction</h2>
          <p>Dream11 Fantasy Sports Pvt. Ltd. ("Dream11", "we", "us", or "our") respects your privacy and is committed to protecting it through our compliance with this policy. This Privacy Policy describes the types of information we may collect from you or that you may provide when you use the Dream11 mobile application or website (collectively, the "App") and our practices for collecting, using, maintaining, protecting, and disclosing that information.</p>
        </Section>

        <Section>
          <h2>2. Information We Collect</h2>
          <p>We collect several types of information from and about users of our App, including:</p>
          <ul>
            <li><strong>Personal Information:</strong> Name, email address, phone number, date of birth, payment information</li>
            <li><strong>Device Information:</strong> IP address, browser type, operating system, mobile device identifiers</li>
            <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the App</li>
            <li><strong>Game Data:</strong> Teams created, contests joined, performance history</li>
            <li><strong>Location Data:</strong> Approximate location based on IP address or GPS (with your permission)</li>
          </ul>
        </Section>

        <Section>
          <h2>3. How We Use Your Information</h2>
          <p>We use information that we collect about you or that you provide to us, including any personal information:</p>
          <ul>
            <li>To provide and maintain our App</li>
            <li>To notify you about changes to our App or services</li>
            <li>To allow you to participate in interactive features of our App</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our App</li>
            <li>To monitor the usage of our App</li>
            <li>To detect, prevent and address technical issues</li>
            <li>To verify your identity and prevent fraud</li>
            <li>To comply with legal obligations</li>
          </ul>
        </Section>

        <Section>
          <h2>4. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect the security of your personal information. However, please remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.</p>
        </Section>

        <Section>
          <h2>5. Data Retention</h2>
          <p>We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.</p>
        </Section>

        <Section>
          <h2>6. Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.</p>
        </Section>

        <Section>
          <h2>7. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <ul>
            <li>By email: privacy@dream11.com</li>
            <li>By visiting this page on our website: www.dream11.com/contact</li>
            <li>By mail: Dream11 Fantasy Sports Pvt. Ltd., 601-602, 6th Floor, B-Wing, Marathon Futurex, N.M. Joshi Marg, Lower Parel, Mumbai - 400013, India</li>
          </ul>
        </Section>
      </PolicyContent>
    </PrivacyPolicyContainer>
  )
}